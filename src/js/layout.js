function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isActive = href === path;
    a.classList.toggle("text-emerald-700", isActive);
    a.classList.toggle("font-semibold", isActive);
  });
}

export function renderLayout() {
  const headerHost = document.getElementById("site-header");
  const footerHost = document.getElementById("site-footer");

  if (headerHost) {
    headerHost.innerHTML = `
      <header data-header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-transparent">
        <div class="container-page h-16 flex items-center justify-between">
          <a href="./" class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">K</div>
            <div class="leading-tight">
              <div class="font-semibold">Klimazon</div>
              <div class="text-xs text-slate-500">Duurzame installaties</div>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-6 text-sm">
            <a data-nav href="diensten" class="hover:text-emerald-700">Diensten</a>
            <a data-nav href="zakelijke-diensten" class="hover:text-emerald-700">Zakelijke diensten</a>
            <a data-nav href="projecten" class="hover:text-emerald-700">Projecten</a>
            <a data-nav href="tel:+31654216787" class="hover:text-emerald-700">Contact</a>
            <a data-nav href="offerte" class="btn-primary">Offerte</a>
          </nav>

          <button
            class="md:hidden inline-flex items-center justify-center p-2 rounded-full border border-slate-200 bg-white"
            aria-label="Open menu"
            aria-expanded="false"
            type="button"
            data-mobile-toggle
          >
            <span class="block w-5 h-[2px] bg-slate-900 mb-1"></span>
            <span class="block w-5 h-[2px] bg-slate-900 mb-1"></span>
            <span class="block w-5 h-[2px] bg-slate-900"></span>
          </button>
        </div>

        <nav class="md:hidden hidden border-t border-slate-100 bg-white" data-mobile-menu>
          <div class="container-page py-4 flex flex-col gap-3 text-sm">
            <a data-nav href="diensten" class="py-1">Diensten</a>
            <a data-nav href="zakelijke-diensten" class="py-1">Zakelijke diensten</a>
            <a data-nav href="projecten" class="py-1">Projecten</a>
            <a data-nav href="tel:+31654216787" class="py-1">Contact</a>
            <a data-nav href="offerte" class="btn-primary w-fit">Offerte</a>
          </div>
        </nav>
      </header>
    `;
  }

  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="border-t border-slate-100 bg-white">
        <div class="container-page py-10 grid gap-6 md:grid-cols-3 text-sm text-slate-600">
          <div>
            <div class="font-semibold text-slate-900">Klimazon</div>
            <div class="mt-2">Duurzame installaties voor woning en bedrijf.</div>
          </div>

          <div class="md:justify-self-center">
            <div class="font-semibold text-slate-900">Pagina’s</div>
            <div class="mt-2 flex flex-col gap-2">
              <a class="hover:text-emerald-700" href="diensten">Diensten</a>
              <a class="hover:text-emerald-700" href="zakelijke-diensten">Zakelijke diensten</a>
              <a class="hover:text-emerald-700" href="projecten">Projecten</a>
            </div>
          </div>

          <div class="md:justify-self-end">
            <div class="font-semibold text-slate-900">Contact</div>
            <div class="mt-2 flex flex-col gap-2">
              <div>Tel: <span class="text-slate-900">06 00000000</span></div>
              <div>E-mail: <span class="text-slate-900">info@klimazon.nl</span></div>
              <div>Regio: <span class="text-slate-900">Noord-Holland</span></div>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100">
          <div class="container-page py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-slate-500">
            <div>© <span id="year"></span> Klimazon</div>
            <div class="flex gap-4">
              <a class="hover:text-emerald-700" href="#">Privacy</a>
              <a class="hover:text-emerald-700" href="#">Algemene voorwaarden</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  setActiveNav();
}
