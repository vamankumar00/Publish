using System;
using System.Data;
using System.Drawing;
using System.Data.SqlClient;
using PrintingApp;

namespace TestPrint
{
    class Program
    {
        static void Main(string[] args)
        {
            try {
                int orderId = 0;
                string connStr = "Server=localhost;Database=rapiido_majestic;Trusted_Connection=True;TrustServerCertificate=True;";
                
                using (SqlConnection conn = new SqlConnection(connStr)) {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("SELECT TOP 1 Id FROM OrderMaster ORDER BY Id DESC", conn)) {
                        object res = cmd.ExecuteScalar();
                        if (res != null) orderId = Convert.ToInt32(res);
                    }
                    if (orderId == 0) return;
                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand("SP_ReciptPrint", conn)) {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@OrderId", orderId);
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd)) { da.Fill(dt); }
                    }
                    if (dt.Rows.Count > 0) {
                        ThermalReceiptPrinter printer = new ThermalReceiptPrinter(dt, "Microsoft Print to PDF");
                        Bitmap bmp = new Bitmap(314, 1500);
                        using (Graphics g = Graphics.FromImage(bmp)) {
                            g.Clear(Color.White);
                            var method = typeof(ThermalReceiptPrinter).GetMethod("DrawReceipt", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                            object result = method.Invoke(printer, new object[] { g, false });
                            float height = Convert.ToSingle(result);
                            Bitmap cropped = bmp.Clone(new Rectangle(0, 0, 314, (int)height + 50), bmp.PixelFormat);
                            cropped.Save("receipt_test.png", System.Drawing.Imaging.ImageFormat.Png);
                        }
                    }
                }
            } catch (Exception ex) { Console.WriteLine(ex.ToString()); }
        }
    }
}
