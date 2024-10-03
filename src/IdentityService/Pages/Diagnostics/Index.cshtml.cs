// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Serilog;

namespace IdentityService.Pages.Diagnostics;

[SecurityHeaders]
[Authorize]
public class Index : PageModel
{
    public ViewModel View { get; set; } = default!;
    private readonly ILogger<Index> _logger;
    public Index(ILogger<Index> logger)
    {
        _logger = logger;
    }

    public async Task<IActionResult> OnGet()
    {
        var localAddresses = new List<string?> { "127.0.0.1", "::1" };
        _logger.LogInformation("### localAddresses are :" + localAddresses);
        // if(HttpContext.Connection.LocalIpAddress != null)
        // {
        //     localAddresses.Add(HttpContext.Connection.LocalIpAddress.ToString());
        // }

        // if (!localAddresses.Contains(HttpContext.Connection.RemoteIpAddress?.ToString()))
        // {
        //     return NotFound();
        // }

        View = new ViewModel(await HttpContext.AuthenticateAsync());

        return Page();
    }
}
