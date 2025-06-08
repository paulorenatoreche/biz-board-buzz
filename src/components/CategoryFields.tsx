
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData, SERVICE_CATEGORIES } from "@/utils/serviceCategories";

interface CategoryFieldsProps {
  form: UseFormReturn<FormData>;
  showCustomCategory: boolean;
  onCategoryChange: (value: string) => void;
}

const CategoryFields = ({ form, showCustomCategory, onCategoryChange }: CategoryFieldsProps) => {
  const selectedCategory = form.watch("category");

  return (
    <div className="space-y-6 w-full">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-gray-700 font-semibold">Categoria do Serviço</FormLabel>
            <Select 
              onValueChange={onCategoryChange} 
              defaultValue={field.value}
              required
            >
              <FormControl>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {showCustomCategory && (
        <FormField
          control={form.control}
          name="customCategory"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-gray-700 font-semibold">Categoria Personalizada</FormLabel>
              <FormControl>
                <Input 
                  required={selectedCategory === "other"}
                  {...field} 
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg w-full"
                  placeholder="Digite sua categoria personalizada"
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default CategoryFields;
