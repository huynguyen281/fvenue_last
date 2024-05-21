using BusinessObjects;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class RolesAPIController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesAPIController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet, Route("GetRoleName/{id}")]
        public ActionResult<JsonModel> GetRoleName(int id)
        {
            try
            {
                var roleName = _roleService.GetRoleName(id);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{roleName}"
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}"
                };
            }
        }
    }
}
