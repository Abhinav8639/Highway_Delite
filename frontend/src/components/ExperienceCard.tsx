import type { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: (id: string) => void;
}

export default function ExperienceCard({ experience, onViewDetails }: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight">{experience.name}</h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0">
            {experience.location}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">From</span>
            <span className="text-lg font-semibold">₹{experience.price}</span>
          </div>

          <button
            onClick={() => onViewDetails(experience.id)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded font-medium text-sm transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
