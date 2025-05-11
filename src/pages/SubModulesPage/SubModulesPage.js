import { useState, useEffect } from "react";
import Image from "../../components/designLayouts/Image";
import { Button, Card, CardContent, Progress } from "../../components/ui";
import imageDemo from "../../assets/images/banner/578.jpg"
import { Link } from "react-router-dom";
export const SubModulesPage = () => {

    const subModules = [
        "Electrical quantities, Voltage, Current, Resistance",
        "Measure AC/DC power supply"
      ];

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Select a Sub-Module</h2>
        <div className="grid grid-cols-1 gap-6">
          {subModules.map((subModule, index) => (
            <Card key={index} className="p-4">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">{subModule}</h3>
                 <Link to={"/sub-module/1"}>
                <Button className="w-full">View Content</Button>
                 </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };