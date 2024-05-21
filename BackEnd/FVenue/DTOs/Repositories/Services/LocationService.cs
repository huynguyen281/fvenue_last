using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class LocationService : ILocationService
    {
        public string GetLocation(int wardId)
        {
            using (var _context = new DatabaseContext())
            {
                var result = _context.Countries
                    .Join(_context.Cities, country => country.Id, city => city.CountryId, (country, city) => new
                    {
                        CountryName = country.Name,
                        CityId = city.Id,
                        CityName = city.Name
                    }).Join(_context.Districts, city => city.CityId, district => district.CityId, (city, district) => new
                    {
                        city.CountryName,
                        city.CityName,
                        DistrictId = district.Id,
                        DistrictName = district.Name
                    }).Join(_context.Wards, district => district.DistrictId, ward => ward.DistrictId, (district, ward) => new
                    {
                        district.CountryName,
                        district.CityName,
                        district.DistrictName,
                        WardId = ward.Id,
                        WardName = ward.Name
                    }).Where(x => x.WardId == wardId).FirstOrDefault();
                return $"{result.WardName}, {result.DistrictName}, {result.CityName}, {result.CountryName}";
            }
        }

        public List<Ward> GetWards()
        {
            using (var _context = new DatabaseContext())
            {
                var wards = _context.Wards.ToList();
                return wards;
            }
        }

        public List<Ward> GetWardModels()
        {
            using (var _context = new DatabaseContext())
            {
                var countries = _context.Countries.ToList();
                var cities = _context.Cities.ToList();
                var districts = _context.Districts.ToList();
                var wards = _context.Wards.ToList();
                return countries
                    .Join(cities, country => country.Id, city => city.CountryId, (country, city) => new City
                    {
                        Country = country,
                        CountryId = country.Id,
                        Id = city.Id,
                        Name = city.Name
                    }).Join(districts, city => city.Id, district => district.CityId, (city, district) => new District
                    {
                        City = city,
                        CityId = city.Id,
                        Id = district.Id,
                        Name = district.Name
                    }).Join(wards, district => district.Id, ward => ward.DistrictId, (district, ward) => new Ward
                    {
                        District = district,
                        DistrictId = district.Id,
                        Id = ward.Id,
                        Name = ward.Name
                    }).ToList();
            }
        }
    }
}
