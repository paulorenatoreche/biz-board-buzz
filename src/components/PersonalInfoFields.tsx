
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/utils/serviceCategories";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<FormData>;
}

const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-6 w-full">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-700 font-semibold">Nome Completo</FormLabel>
            <FormControl>
              <Input 
                required 
                {...field} 
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full"
                placeholder="Digite seu nome completo"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-700 font-semibold">Telefone</FormLabel>
            <FormControl>
              <Input 
                required 
                type="tel" 
                {...field} 
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full"
                placeholder="(11) 99999-9999"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
            <FormControl>
              <Input 
                required 
                type="email" 
                {...field} 
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full"
                placeholder="seuemail@empresa.com"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-700 font-semibold">Nome da Empresa</FormLabel>
            <FormControl>
              <Input 
                required 
                {...field} 
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full"
                placeholder="Nome da sua empresa"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalInfoFields;
