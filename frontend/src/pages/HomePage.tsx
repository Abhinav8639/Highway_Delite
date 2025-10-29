import { useEffect, useState } from 'react';
import type { Experience } from '../types';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');  // Added for search

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter((exp) =>
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperiences(filtered);
    }
  }, [searchQuery, experiences]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/experiences`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewDetails = (id: string) => {
    onNavigate('details', { experienceId: id });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">Loading experiences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Experiences</h1>
          <p className="text-gray-600">Discover amazing adventures near you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {searchQuery ? 'No experiences found matching your search.' : 'No experiences available.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}