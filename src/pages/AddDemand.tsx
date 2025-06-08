
import AddDemandHeader from "@/components/AddDemandHeader";
import AddDemandForm from "@/components/AddDemandForm";

const AddDemand = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
      <AddDemandHeader />
      <AddDemandForm />
    </div>
  );
};

export default AddDemand;
