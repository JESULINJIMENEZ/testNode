import { pool } from "../db.js";
import ExcelJS from "exceljs";
//Obtener empleados
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Empleado no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//Crear empleado
// export const createEmployees = async (req, res) => {
//   try {
//     const { name, salary } = req.body;
//     const [rows] = await pool.query(
//       "INSERT INTO employee (name, salary) VALUES (? , ?)",
//       [name, salary]
//     );
//     res.send({
//       id: rows.insertId,
//       name,
//       salary,
//     });
//     console.log(req.body);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error en el servidor",
//       error: 500,
//     });
//   }
// };

//Crear empleado con transacciones
export const createEmployees = async (req,res)=>{
  try {
    const { name, salary } = req.body;
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(
      "INSERT INTO employee (name, salary) VALUES (? , ?)",
      [name, salary]
    );
    await connection.commit();
    connection.release();
    res.send({
      id: result.insertId,
      name,
      salary,
    });
  } catch (error) {
    connection.rollback();
    connection.release();
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
}

//update employees
export const updateEmployees = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    const [result] = await pool.query(
      "UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
      [name, salary, id]
    );
    console.log(result);

    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//eliminar employees
export const deleteEmployees = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM employee WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//Exportar para excel
export const exportEmployeesToExcel = async (req, res) => {
  console.log("Ruta /employees/exportar llamada");

  console.log("Consultando empleados para exportar...");

  const [rows] = await pool.query("SELECT * FROM employee;");

  if (rows.length <= 0) {
    console.log("No se encontraron empleados en la base de datos.");
    return res.status(404).json({ message: "No hay empleados para exportar" });
  }

  console.log("Empleados obtenidos:", rows);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Empleados");

  const columns = Object.keys(rows[0]);
  worksheet.columns = columns.map((key) => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    key: key,
    width: 20,
  }));

  rows.forEach((employee) => {
    worksheet.addRow(employee);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=empleados.xlsx");

  await workbook.xlsx.write(res);
  res.end();

  console.log("Archivo Excel generado y enviado exitosamente.");
};
