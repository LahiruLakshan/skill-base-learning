// components/ModulesPage.js
import Image from "../../components/designLayouts/Image";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import imageDemo from "../../assets/images/banner/578.jpg";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Principles Of Electricity",
    description: "Learn the basics of electrical quantities, power systems, and wiring techniques.",
  },
  {
    title: "Occupational Health And Safety",
    description: "Understand workplace safety measures, fire safety, and personal protective equipment.",
  },
  {
    title: "Electrical Installation In Buildings",
    description: "Master electrical wiring, circuit installation, and distribution board setup.",
  }
];

const ModulesPage = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {modules.map((module, index) => (
        <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
            <Image
          className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
          imgSrc={imageDemo}
        />
            <p className="text-gray-600 mb-4">{module.description}</p>
            <Link to={"/modules/1"}>
            <Button className="w-full">Start Learning</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModulesPage;