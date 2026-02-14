interface ProfileIconProps {
  filled?: boolean;
  className?: string;
}

export function ProfileIcon({ filled = false, className }: ProfileIconProps) {
  if (filled) {
    // vuesax/bold/frame
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18.5 9.52C18.5 10.42 17.77 11.15 16.87 11.15C15.97 11.15 15.24 10.42 15.24 9.52C15.24 8.62 15.97 7.89 16.87 7.89C17.77 7.89 18.5 8.62 18.5 9.52ZM8.09 15.58C7.52 15.58 7.05 15.11 7.05 14.54C7.05 13.97 7.52 13.5 8.09 13.5C8.66 13.5 9.13 13.97 9.13 14.54C9.13 15.11 8.66 15.58 8.09 15.58ZM18.5 17.88C18.5 18.13 18.28 18.35 18.03 18.35C17.9 18.35 17.77 18.29 17.68 18.2L7.2 7.72C7.02 7.54 7.02 7.25 7.2 7.07C7.38 6.89 7.67 6.89 7.85 7.07L18.33 17.55C18.43 17.64 18.5 17.77 18.5 17.88Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  // vuesax/linear/frame
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
