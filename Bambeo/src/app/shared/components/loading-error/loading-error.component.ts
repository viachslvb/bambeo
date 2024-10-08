import { Component } from '@angular/core';

@Component({
  selector: 'bb-loading-error',
  template: `
    <section class="flex flex-col items-center justify-center my-10 px-6 mx-auto">
      <div class="w-full bg-white rounded-lg shadow md:mt-0 xs:max-w-md p-8">
        <div class="flex justify-center items-center">
          <div class="text-center">
            <p class="font-medium text-slate-700 text-lg mb-1">Błąd podczas pobierania danych</p>
            <p class="font-light text-slate-500 mb-4">Prosimy odświeżyć stronę lub spróbować później.</p>
            <button (click)="reload()"
                    class="px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 focus:ring-4 focus:ring-rose-300 font-medium rounded-lg">
              Odśwież
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LoadingErrorComponent {
  reload() {
    window.location.reload();
  }
}
