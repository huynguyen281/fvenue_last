using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Account;
using DTOs.Models.Category;
using DTOs.Models.Item;
using DTOs.Models.Payment;
using DTOs.Models.Schedule;
using DTOs.Models.SubCategory;
using DTOs.Models.SubCategoryRequest;
using DTOs.Models.Venue;
using DTOs.Repositories.Interfaces;

namespace FVenue.API
{
    public class ProgramMapper : Profile
    {
        // Hạn chế sử dụng DI trong AutoMapper
        public ProgramMapper(
            IAccountService accountService,
            ICategoryService categoryService,
            ILocationService locationService,
            ISubCategoryService subCategoryService)
        {
            #region Account

            CreateMap<Account, AccountDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.CreateDate)))
                .ForMember(dest => dest.LastUpdateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.LastUpdateDate)))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => Common.GetRoleName(src.RoleId)))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                .ForMember(dest => dest.BirthDay, opt => opt.MapFrom(src => Common.FormatDateTime(src.BirthDay)))
                .ForMember(dest => dest.LoginMethod, opt => opt.MapFrom(src => src.LoginMethod))
                .ForMember(dest => dest.IsEmailConfirmed, opt => opt.MapFrom(src => src.IsEmailConfirmed));
            CreateMap<AccountInsertDTO, Account>();

            #endregion

            #region Category

            CreateMap<Category, CategoryDTO>();

            #endregion

            #region Item

            CreateMap<Item, ItemDTO>()
                .ForMember(dest => dest.VenueName, opt => opt.MapFrom(src => src.Venue.Name))
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.CreateDate)))
                .ForMember(dest => dest.LastUpdateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.LastUpdateDate)));
            CreateMap<ItemTicketInsertDTO, ItemTicket>()
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => DateTime.Now));

            #endregion

            #region Schedule

            CreateMap<Schedule, ScheduleDTO>()
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.CreateDate)))
                .ForMember(dest => dest.LastUpdateDate, opt => opt.MapFrom(src => Common.FormatDateTime(src.LastUpdateDate)))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account.FullName))
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => Common.ConvertScheduleTypeToTime(src.Type)));

            #endregion

            #region SubCategory

            CreateMap<SubCategory, SubCategoryDTO>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
            CreateMap<SubCategoryRequest, SubCategoryRequestDTO>()
                .ForMember(dest => dest.RequestUserName, opt => opt.MapFrom(src => src.RequestUser.FullName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => Common.SetBadgeBaseOnCreateDate(src.CreateDate)));
            CreateMap<SubCategoryInsertDTO, SubCategory>()
                .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.LastUpdateDate, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => true));
            CreateMap<SubCategoryUpdateDTO, SubCategory>()
                .ForMember(dest => dest.LastUpdateDate, opt => opt.MapFrom(src => DateTime.Now));
            CreateMap<SubCategory, SubCategoryUpdateDTO>();

            #endregion

            #region Venue

            CreateMap<Venue, VenueDTO>()
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => $"{src.Ward.Name}, {src.Ward.District.Name}, {src.Ward.District.City.Name}, {src.Ward.District.City.Country.Name}"))
                .ForMember(dest => dest.GeoLocation, opt => opt.MapFrom(src => src.GeoLocation))
                .ForMember(dest => dest.OpenTime, opt => opt.MapFrom(src => Common.ConvertDateTimeToTimeOnly(src.OpenTime)))
                .ForMember(dest => dest.CloseTime, opt => opt.MapFrom(src => Common.ConvertDateTimeToTimeOnly(src.CloseTime)))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account == null ? String.Empty : src.Account.FullName));
            CreateMap<VenueInsertDTO, Venue>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.OpenTime, opt => opt.MapFrom(src => Common.ConvertTimeOnlyToDateTime(src.OpenTime)))
                .ForMember(dest => dest.CloseTime, opt => opt.MapFrom(src => Common.ConvertTimeOnlyToDateTime(src.CloseTime)));
            CreateMap<VenueUpdateDTO, Venue>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.OpenTime, opt => opt.MapFrom(src => Common.ConvertTimeOnlyToDateTime(src.OpenTime)))
                .ForMember(dest => dest.CloseTime, opt => opt.MapFrom(src => Common.ConvertTimeOnlyToDateTime(src.CloseTime)));

            #endregion

            #region VNPAYPayment

            CreateMap<VNPAYPayment, VNPAYPaymentAdminDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image));

            #endregion
        }
    }
}
