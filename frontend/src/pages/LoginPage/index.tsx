import { LoginForm } from "../../features/AuthByUsername/ui/LoginForm";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
            THE LAST OF <span className="text-blue-600">GOOSE</span>
          </h1>
          <p className="text-slate-500">Survival of the tappest</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
