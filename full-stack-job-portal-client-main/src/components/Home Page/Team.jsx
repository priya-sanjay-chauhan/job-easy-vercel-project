const people = [
  {
    name: "Vedang Gore",
    role: "Co-Founder",
    imageUrl: "/src/assets/media/vng.png",
  },
  {
    name: "Sarthak Rane",
    role: "Co-Founder",
    imageUrl: "/src/assets/media/srt.png",
  },
  {
    name: "Priya Chauhan",
    role: "Co-Founder",
    imageUrl: "/src/assets/media/pry.png",
  },
];

export default function Team() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
          {/* Text content on the left */}
          <div className="max-w-2xl lg:max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet our leadership
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Meet the visionary leaders behind our platform who are passionate
              about transforming the way people find their dream careers. Our
              leadership team brings together decades of experience in
              technology, recruitment, and workforce innovation.
            </p>
          </div>

          {/* Co-founders on the right */}
          <div className="flex-shrink-0">
            <ul
              role="list"
              className="flex flex-wrap justify-center lg:justify-end gap-x-8 gap-y-8 sm:gap-x-12"
            >
              {people.map((person) => (
                <li key={person.name} className="flex flex-col items-center">
                  <div className="flex flex-col items-center gap-y-4">
                    <img
                      className="h-20 w-20 rounded-full"
                      src={person.imageUrl}
                      alt=""
                    />
                    <div className="text-center">
                      <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                        {person.name}
                      </h3>
                      <p className="text-sm font-semibold leading-6 text-indigo-600">
                        {person.role}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
