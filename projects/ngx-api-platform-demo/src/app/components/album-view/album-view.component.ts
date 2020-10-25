import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ApiServiceTokenFor, JsonCollection } from 'ngx-api-platform';
import { of, Subscription, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Album } from '../../resources/album';

@Component({
  selector: 'app-album-view',
  templateUrl: './album-view.component.html',
})
export class AlbumViewComponent implements OnInit, OnDestroy {
  activateTabId: string;

  album: Album;

  subscription: Subscription;

  constructor(
    @Inject(ApiServiceTokenFor(Album)) private albumApiService: ApiService<Album, JsonCollection<Album>>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscription = zip(
      this.activatedRoute.params,
      this.activatedRoute.fragment,
    )
      .pipe(
        switchMap(([params, fragment]) => {
          this.activateTabId = fragment;

          if (params.hasOwnProperty('album')) {
            return this.albumApiService.getItem(params.album);
          }

          return of(null);
        }),
      )
      .subscribe((album: Album) => this.album = album);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  updateFragmentForActiveTab(activeId: string): void {
    if (activeId) {
      this.router.navigate([], {fragment: activeId});
    }
  }
}
