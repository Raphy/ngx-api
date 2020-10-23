import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService, ApiServiceTokenFor } from 'ngx-api-platform';
import { Subscription } from 'rxjs';
import { Album } from '../../resources/album';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
})
export class AlbumListComponent implements OnInit, OnDestroy {
  albums: Array<Album>;

  subscription: Subscription;

  constructor(
    @Inject(ApiServiceTokenFor(Album)) private albumApiService: ApiService<Album>,
  ) {
  }

  ngOnInit(): void {
    this.albumApiService.findCollection().subscribe((albums: Array<Album>) => this.albums = albums);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
