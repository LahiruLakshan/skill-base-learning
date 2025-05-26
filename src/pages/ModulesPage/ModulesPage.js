// components/ModulesPage.js
import React, { useEffect, useState } from 'react';
import Image from "../../components/designLayouts/Image";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import imageDemo from "../../assets/images/banner/578.jpg";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const DemoModules = [
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

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'modules'));
        const modulesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("modulesData : ", modulesData);
        
        setModules(modulesData.filter((mod) => localStorage.getItem("level") === "Beginner"
          ? mod.level === "Beginner"
          : localStorage.getItem("level") === "Intermediate"
          ? mod.level === "Beginner" || mod.level === "Intermediate"
          : mod.level === "Beginner" ||
            mod.level === "Intermediate" ||
            mod.level === "Advanced" ));
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };
        console.log("modulesData : ");

    fetchModules();
  }, []);

 return (
  <div className="p-6">
    {loading ? (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
              <h3 className="mb-2">{module.level}</h3>
              <Image
                className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                imgSrc={module.thumbnail_url}
              />
              <p className="text-gray-600 mb-4">{module.description}</p>
              <Link to={`/modules/${module.id}`}>
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

};

export default ModulesPage;