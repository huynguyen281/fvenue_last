using BusinessObjects;
using Quartz;

namespace FVenue.API.Jobs
{
    public class DeleteUnusedImagesJob : IJob
    {
        private readonly string host;
        private readonly ILogger<DeleteUnusedImagesJob> _logger;

        public DeleteUnusedImagesJob(IConfiguration configuration, ILogger<DeleteUnusedImagesJob> logger)
        {
            host = configuration["Host"];
            _logger = logger;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("Delete Unused Images Job start at {DateTime}", DateTime.Now);
            HttpClient client = Common.GenerateHttpClient();
            var response = await client.DeleteAsync($"{host}/API/ImageAPI/DeleteUnusedImages", new CancellationTokenSource(TimeSpan.FromMinutes(5)).Token);
            var content = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("{StatusCode}: {ReasonPhrase}", response.StatusCode, response.ReasonPhrase);
                _logger.LogError("{Content}", content);
            }
            else
                _logger.LogInformation("{Content}", content);
            _logger.LogInformation("Delete Unused Images Job end at {DateTime}", DateTime.Now);
        }
    }
}
