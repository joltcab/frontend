import React from "react";
import TestDatabaseConnection from "../components/test/TestDatabaseConnection";

const TestDatabase = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-6">Prueba de Base de Datos</h1>
      <TestDatabaseConnection />
    </div>
  );
};

export default TestDatabase;
