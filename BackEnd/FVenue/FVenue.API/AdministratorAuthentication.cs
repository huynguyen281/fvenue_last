using BusinessObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FVenue.API
{
    public class AdministratorAuthentication : ActionFilterAttribute
    {
        private readonly RedirectToRouteResult authenticationMiddlewareRoute = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Home" }, { "Action", "AuthenticationMiddleware" } });

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session.GetString("AdministratorName") == null)
            {
                filterContext.Result = authenticationMiddlewareRoute;
            }
            else
            {
                using (var _context = new DatabaseContext())
                {
                    var administratorNames = _context.Accounts.Select(x => x.FullName).ToList();
                    if (!administratorNames.Contains(filterContext.HttpContext.Session.GetString("AdministratorName")))
                        filterContext.Result = authenticationMiddlewareRoute;
                }
            }
        }
    }
}
