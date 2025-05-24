import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "../../components/designLayouts/Image";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import imageDemo from "../../assets/images/banner/578.jpg";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
export const SubModulesPage = () => {
  const { id } = useParams();
  const [subModules, setSubModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    console.log("parms : ", id);

    const fetchSubModules = async () => {
      try {
        const q = query(
          collection(db, "sub_modules"),
          where("module_id", "==", id)
        );

        const querySnapshot = await getDocs(q);
        const subModulesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("subModulesData : ", subModulesData);

        setSubModules(subModulesData);
      } catch (error) {
        console.error("Error fetching sub-modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubModules();
  }, [id]);

  return (
  <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Select a Sub-Module</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subModules.map((subModule, index) => (
          <Card key={index} className="p-4">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">{subModule.title}</h3>
              <Image
                className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                imgSrc={subModule.thumbnail_url}
              />
                            <p className="text-gray-600 mb-4">{module.description}</p>

              <Link to={`/sub-module/${subModule.id}`} state={{ subModule }}>
                <Button className="w-full">View Content</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
      </div>
    </div>
  );
};
