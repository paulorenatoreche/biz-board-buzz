import { useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Handshake } from "lucide-react";
import { toast } from "sonner";

interface PasswordProtectionProps {
  children: ReactNode;
  correctPassword: string;
}

const PasswordProtection = ({ children, correctPassword }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem("authenticated");
    return auth === "true";
  });
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("authenticated", "true");
      toast.success("Acesso liberado!");
    } else {
      toast.error("Senha incorreta. Tente novamente.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
      {/* Logos fixas nos cantos superiores */}
      <div className="fixed top-6 left-6 z-20" style={{ transform: 'translateY(12px)' }}>
        <img
          src="/lovable-uploads/af_datlaz_logo_br.png"
          alt="Datlaz Logo"
          className="h-8 md:h-10 drop-shadow-lg"
        />
      </div>
      <div className="fixed top-3 right-6 z-20" style={{ marginTop: '5.1px' }}>
        <img
          src="/lovable-uploads/abeeolica_logo_br.png"
          alt="ABEEÓLICA Logo"
          className="h-8 md:h-14 drop-shadow-lg"
        />
      </div>

      <Card className="w-full max-w-md mx-4 bg-white border-0 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6 pt-10">
          <div className="mx-auto flex items-center justify-center mb-6">
            <Handshake style={{ color: 'rgb(60, 71, 157)' }} size={45}/>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'rgb(60, 71, 157)' }}>Hub de Negócios</h1>
          <p className="text-gray-600 text-base leading-relaxed">Sistema inteligente de gestão de oportunidades de negócios</p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="pr-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg "
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-white border-0 shadow-lg rounded-lg font-semibold text-base  hover:shadow-xl hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
              }}
            >
              Acessar Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordProtection;
