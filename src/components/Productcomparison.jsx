import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

const ProductComparison = () => {
  const features = [
    {
      category: "Organization",
      items: [
        {
          name: "AI-Powered Auto Organization",
          ours: true,
          dropbox: false,
          googlePhotos: true,
          icloud: false,
        },
        {
          name: "Smart Albums Creation",
          ours: true,
          dropbox: false,
          googlePhotos: true,
          icloud: true,
        },
        {
          name: "Custom Tags & Categories",
          ours: true,
          dropbox: true,
          googlePhotos: true,
          icloud: false,
        }
      ]
    },
    {
      category: "AI Features",
      items: [
        {
          name: "Advanced Face Recognition",
          ours: true,
          dropbox: false,
          googlePhotos: true,
          icloud: true,
        },
        {
          name: "Object Detection & Smart Categorization",
          ours: true,
          dropbox: false,
          googlePhotos: true,
          icloud: false,
        },
        {
          name: "Intelligent Scene Analysis",
          ours: true,
          dropbox: false,
          googlePhotos: true,
          icloud: false,
        }
      ]
    },
    {
      category: "Security",
      items: [
        {
          name: "End-to-End Encryption",
          ours: true,
          dropbox: true,
          googlePhotos: false,
          icloud: true,
        },
        {
          name: "Secure Sharing Options",
          ours: true,
          dropbox: true,
          googlePhotos: true,
          icloud: true,
        },
        {
          name: "Password Protected Albums",
          ours: true,
          dropbox: true,
          googlePhotos: false,
          icloud: false,
        }
      ]
    }
  ];

  const Check = () => (
    <div className="flex justify-center">
      <CheckIcon className="w-5 h-5 text-green-500" />
    </div>
  );

  const Cross = () => (
    <div className="flex justify-center">
      <XIcon className="w-5 h-5 text-red-500" />
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto">
      {/* Heading with two lines */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-semibold text-gray-900">Why Recollect Space is the Best Choice</h2>
        <p className="text-lg text-gray-600 mt-2">See how we outperform other platforms with unmatched features and security.</p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 px-6 text-left text-sm font-normal text-gray-500">
              FEATURES
            </th>
            <th className="py-4 px-6 text-center text-sm font-normal" style={{ color: '#8B5CF6' }}>
              OUR PLATFORM
            </th>
            <th className="py-4 px-6 text-center text-sm font-normal text-gray-500">
              DROPBOX
            </th>
            <th className="py-4 px-6 text-center text-sm font-normal text-gray-500">
              GOOGLE PHOTOS
            </th>
            <th className="py-4 px-6 text-center text-sm font-normal text-gray-500">
              iCLOUD
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((category) => (
            category.items.map((feature, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-4 px-6 text-sm text-gray-900">{feature.name}</td>
                <td className="py-4 px-6">
                  {feature.ours ? <Check /> : <Cross />}
                </td>
                <td className="py-4 px-6">
                  {feature.dropbox ? <Check /> : <Cross />}
                </td>
                <td className="py-4 px-6">
                  {feature.googlePhotos ? <Check /> : <Cross />}
                </td>
                <td className="py-4 px-6">
                  {feature.icloud ? <Check /> : <Cross />}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparison;
