function Error({ error }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold uppercase">
          Something went wrong
        </h1>
        <p className="mb-4 text-4xl uppercase">{error}</p>
        <button
          className="bg-primary-700 cursor-pointer rounded-full px-8 py-3 text-2xl"
          onClick={() => window.location.replace("/")}
        >
          Back To Home Page
        </button>
      </div>
    </div>
  );
}

export default Error;
