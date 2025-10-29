//i have written all in one file to make it fast 
//we can seperate them for better structure

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase env vars');
}

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// GET /experiences
app.get('/experiences', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /experiences/:id
app.get('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: exp, error: expError } = await supabase.from('experiences').select('*').eq('id', id).maybeSingle();
    if (expError || !exp) return res.status(404).json({ error: 'Experience not found' });

    const today = new Date().toISOString().split('T')[0]; // 2025-10-28
    const { data: slots, error: slotsError } = await supabase
      .from('slots')
      .select('*')
      .eq('experience_id', id)
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    if (slotsError) throw slotsError;

    res.json({ ...exp, slots: slots || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /promo/validate
app.post('/promo/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) return res.status(400).json({ error: 'Missing code or subtotal' });

    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();
    if (error || !data) return res.status(400).json({ valid: false, error: 'Invalid promo code' });

    let discountAmount = 0;
    if (data.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * data.discount_value) / 100);
    } else {
      discountAmount = data.discount_value;
    }

    const discount = Math.min(discountAmount, subtotal);
    res.json({ valid: true, discount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /bookings
app.post('/bookings', async (req, res) => {
  try {
    const {
      experience_id, slot_id, full_name, email, quantity, subtotal, taxes, total, promo_code, discount
    } = req.body;
    if (!experience_id || !slot_id || !full_name || !email || quantity === undefined || subtotal === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate slot availability
    const { data: slot, error: slotError } = await supabase.from('slots').select('*').eq('id', slot_id).maybeSingle();
    if (slotError || !slot || (slot.booked + quantity > slot.capacity)) {
      return res.status(400).json({ error: 'Slot unavailable or not enough capacity' });
    }

    // Generate unique ref
    const generateRef = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let ref = '';
      for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
      return ref;
    };
    let bookingRef = generateRef();
    let refExists = true;
    while (refExists) {
      const { data: existing } = await supabase.from('bookings').select('id').eq('booking_ref', bookingRef).maybeSingle();
      if (!existing) refExists = false;
      else bookingRef = generateRef();
    }

    // Insert booking
    const { data: booking, error: bookingError } = await supabase.from('bookings').insert({
      booking_ref: bookingRef,
      experience_id,
      slot_id,
      full_name,
      email,
      quantity,
      subtotal,
      taxes,
      total,
      promo_code: promo_code || null,
      discount: discount || 0,
    }).select().single();
    if (bookingError) throw bookingError;

    // Update slot
    const { error: updateError } = await supabase
      .from('slots')
      .update({ booked: slot.booked + quantity })
      .eq('id', slot_id);
    if (updateError) throw updateError;

    res.json({ success: true, booking_ref: bookingRef, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});