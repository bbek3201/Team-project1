export function AuthHero() {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center bg-amber-400 px-12 text-center">
      <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-amber-500">
        <img src="/illustration.svg" alt="" />
      </div>
      <h1 className="mb-4 text-4xl font-bold">Fund your creative work</h1>
      <p className="max-w-md text-lg">
        Accept support. Start a membership. Setup a shop. It&apos;s easier than
        you think.
      </p>
    </div>
  );
}
