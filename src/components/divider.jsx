import Divider from "@mui/material/Divider";

const StyledDivider = ({ width, margin , marginTop , opacity}) => (
    <Divider
      style={{
        borderColor: "white",
        opacity: 0.3 ,
        width,
        margin:"5px auto",
        marginTop: "5px"
      }}
    />
  );
  
  // ثم يمكنك استخدامه في المكون الرئيسي كما يلي:
export default StyledDivider
  