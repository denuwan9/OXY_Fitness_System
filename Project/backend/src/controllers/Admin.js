
import UserModel from "../models/userModel.js" 
import bcrypt from "bcryptjs"
import PDFDocument from "pdfkit"



const Getuser=async(req,res)=>{
    try {
        const users = await UserModel.find()
        res.status(200).json({users})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        console.log(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Prevent admin self-deletion
        if (user.role === 'admin') {
            return res.status(403).json({ 
                success: false,
                message: "Admins cannot delete themselves" 
            });
        }

        // Perform deletion
        await UserModel.findByIdAndDelete(userId);
        
        res.status(200).json({ 
            success: true,
            message: "User deleted successfully",
            deletedUserId: userId
        });
        
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }  
};


// updateuser
const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      // Prevent role escalation if needed
      /*if (updateData.role === 'admin') {
        return res.status(403).json({ message: "Cannot change role to admin" });
      }*/


        // If password is provided and not empty, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      // If no password provided, remove it from update
      delete updateData.password;
    }
        
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error: error.message });
    }
  };


  
    const generatePDF = async (req, res) => {
      try {
        const users = await UserModel.find({});
        
        // Create PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=users_report.pdf');
        
        doc.pipe(res);
        
        // Add content
        doc.fontSize(18).text('OXY FITNESS - User Details', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);
        
        // Add table
        const table = {
          headers: ['ID', 'Name', 'Email', 'Role', 'Phone'],
          rows: users.map(user => [
            user._id.toString(),
            `${user.fname} ${user.lname}`,
            user.email,
            user.role,
            user.number || 'N/A'
          ])
        };
        
        // Simple table implementation
        doc.font('Helvetica-Bold').text(table.headers.join(' | '));
        doc.font('Helvetica');
        table.rows.forEach(row => {
          doc.text(row.join(' | '));
        });
        
        doc.end();
      } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
      }
    };
export {Getuser,deleteUser,updateUser,generatePDF}