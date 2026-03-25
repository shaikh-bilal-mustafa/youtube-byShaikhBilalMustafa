const VideoSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <div className="bg-gray-300 h-40 w-full rounded-lg"></div>

      {/* Title */}
      <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>

      {/* Channel */}
      <div className="mt-1 h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

const SkeletonList = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <VideoSkeleton key={index} />
        ))}
    </div>
  );
};
export { SkeletonList };