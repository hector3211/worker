export default function Loading() {
  return (
    <div className="animate-pulse min-h-screen max-w-full">
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div
            className="radial-progress animate-spin"
            // @ts-ignore
            style={{ "--value": 25 }}
          ></div>
        </div>
      </div>
    </div>
  );
}
