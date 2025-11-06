export default function HowWorks() {
  return (
    <div className="w-full bg-[rgb(54,55,245)] -mt-[4px]">
      <div className="relative pb-24 sm:pb-32 mx-auto max-w-7xl px-6 lg:px-8 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Why Us?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Smart Matching */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Smart Job Matching
            </h3>
            <p className="text-white/90">
              Our intelligent algorithm matches your skills and preferences with
              the perfect job opportunities, saving you time and effort in your
              job search.
            </p>
          </div>

          {/* Real-time Updates */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-white/90">
              Get instant notifications about new job postings and application
              status updates. Never miss an opportunity that's right for you.
            </p>
          </div>

          {/* Easy Application */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Easy Application Process
            </h3>
            <p className="text-white/90">
              Apply to multiple jobs with just a few clicks. Our streamlined
              application process makes job hunting effortless and efficient.
            </p>
          </div>

          {/* Verified Employers */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Verified Employers
            </h3>
            <p className="text-white/90">
              Connect with legitimate companies and organizations. All employers
              on our platform are verified to ensure a safe and trustworthy job
              search experience.
            </p>
          </div>

          {/* Career Resources */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Career Resources
            </h3>
            <p className="text-white/90">
              Access a wealth of career development resources, including resume
              tips, interview guides, and industry insights to help you succeed.
            </p>
          </div>

          {/* Mobile Friendly */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Mobile Friendly
            </h3>
            <p className="text-white/90">
              Search and apply for jobs on any device. Our responsive design
              ensures a seamless experience whether you're on desktop or mobile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
