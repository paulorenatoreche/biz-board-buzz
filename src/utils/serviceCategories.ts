
// Service categories with their tag colors
export const SERVICE_CATEGORIES = [
  { value: "civil-project", label: "Projeto Civil", color: "#F2FCE2" },
  { value: "electrical-project", label: "Projeto Elétrico", color: "#FEF7CD" },
  { value: "electrical-studies", label: "Estudos Elétricos", color: "#FEC6A1" },
  { value: "environmental-services", label: "Serviços Ambientais", color: "#E5DEFF" },
  { value: "engineering-consulting", label: "Consultoria em Engenharia", color: "#FFDEE2" },
  { value: "equipment", label: "Equipamentos", color: "#FDE1D3" },
  { value: "o-and-m", label: "O&M", color: "#D3E4FD" },
  { value: "training-courses", label: "Treinamentos & Cursos", color: "#F1F0FB" },
];

export interface FormData {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  description: string;
  category: string;
  customCategory: string;
}
