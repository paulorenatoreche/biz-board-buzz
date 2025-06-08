
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/utils/serviceCategories";

interface DescriptionFieldProps {
  form: UseFormReturn<FormData>;
}

const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-semibold">Descrição (máx. 300 palavras)</FormLabel>
          <FormControl>
            <Textarea
              required
              className="h-32 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg resize-none"
              placeholder="Descreva detalhadamente a oportunidade de negócio, requisitos específicos e expectativas..."
              {...field}
              onChange={e => {
                const words = e.target.value.trim().split(/\s+/).length;
                if (words <= 300) {
                  field.onChange(e);
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
