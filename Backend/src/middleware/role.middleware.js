
const roleMiddleware=(...allowedRoles)=>{
  return(req, res, next)=>{
    
    if(!allowedRoles.includes(req.user.role)){
      res.status(401).json({
        message: "Access denied"
      })
    }
    next();
  }
}

export default roleMiddleware;