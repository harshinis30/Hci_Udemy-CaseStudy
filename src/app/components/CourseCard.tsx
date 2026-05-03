interface CourseCardProps {
  title: string;
  instructor: string;
  rating: number;
  price: string;
  image: string;
  isLoading?: boolean;
}

export function CourseCard({ title, instructor, rating, price, image, isLoading }: CourseCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="w-full h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
        <div className="p-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{instructor}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-bold text-yellow-600">{rating}</span>
            <span className="text-yellow-500">★★★★★</span>
          </div>
          <span className="font-bold text-lg text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
}
