import { useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/20 to-slate-900"></div>
      
      {/* Logos fixas nos cantos superiores */}
      <div className="fixed top-6 left-6 z-10" style={{ transform: 'translateY(12px)' }}>
        <img 
          src="/public/lovable-uploads/af_datlaz_logo_br.png" 
          alt="Datlaz Logo" 
          className="h-8 md:h-10" 
        />
      </div>
      <div className="fixed top-6 right-6 z-10" style={{ marginTop: '5.1px' }}>
        <img 
          src="https://abeeolica.org.br/wp-content/themes/abeeolica/dist/img/logotipo.svg" 
          alt="ABEEÓLICA Logo" 
          className="h-8 md:h-10" 
        />
      </div>
      
      <Card className="w-full max-w-lg mx-auto bg-slate-800/90 border-slate-700/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-6 pt-8">
          <h1 className="text-3xl font-bold text-white mb-4">Hub de Negócios</h1>
          <p className="text-slate-300 text-base leading-relaxed">Sistema inteligente de gestão de oportunidades de negócios</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
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