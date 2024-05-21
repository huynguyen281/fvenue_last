using BusinessObjects.Models;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationAPIController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationAPIController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        #region Ward

        [HttpGet, Route("GetWards")]
        public List<Ward> GetWards() => _locationService.GetWards();

        #endregion
    }
}
