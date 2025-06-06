export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh]'>
      <div className='animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent mb-4' />
      <span className='text-xl text-gray-700'>読み込み中...</span>
    </div>
  );
}
