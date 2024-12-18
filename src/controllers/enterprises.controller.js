import { pool } from "../db.js";


//Obtener empresas
export const getEnterprises = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM enterprise");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//Obtener empresa por id
export const getEnterpriseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM enterprise WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Empresa no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//Crear empresa
export const createEnterprise = async (req, res) => {
  let connection;
  try {
    const { name, employee_id } = req.body;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO enterprise (name, employee_id) VALUES (? , ?)",
      [name, employee_id]
    );

    await connection.commit();
    connection.release();
    res.send({
      id: result.insertId,
      name,
      employee_id,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Actualizar empresa
export const updateEnterprise = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, employee_id } = req.body;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE enterprise SET name = ?, employee_id = ? WHERE id = ?",
      [name, employee_id, id]
    );

    await connection.commit();

    connection.release();
    res.json({
      id,
      name,
      employee_id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

//eliminar empresa
export const deleteEnterprise = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query("DELETE FROM enterprise WHERE id = ?", [id]);

    await connection.commit();

    connection.release();
    res.json({ message: "Empresa eliminada" });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: 500,
    });
  }
};

// //Exportar empresas a excel
// export const exportEnterprises = async (req, res) => {
//     try {
//         const [rows] = await pool.query("SELECT * FROM enterprise");
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Empresas");

//         worksheet.columns = [
//             { header: "ID", key: "id" },
//             { header: "Nombre", key: "name" },
//             { header: "ID Empleado", key: "employee_id" },
//         ];

//         rows.forEach((enterprise) => {
//             worksheet.addRow(enterprise);
//         });

//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=" + "empresas.xlsx"
//         );

//         await workbook.xlsx.write(res);
//         res.end();
//     } catch (error) {
//         res.status(500).json({
//             message: "Error en el servidor",
//             error: 500,
//         });
//     }
// }
