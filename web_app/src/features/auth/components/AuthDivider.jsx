export const AuthDivider = ({ text = 'Hoặc' }) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2 bg-primary text-foreground-lighter">{text}</span>
      </div>
    </div>
  );
};
