import { Favorite } from './../../model/favorite';
import { AuthService } from './../../auth/auth.service';
import { ErrorService } from './../../error/error.service';
import { Movie } from './../../model/movie';
import { MoviesService } from './movies.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies',
  template: `

  <div *ngIf="isLoading && !this.error" class="w-100 d-flex justify-content-center p-3">
    <mat-spinner></mat-spinner>
  </div>
  <div fxLayout="row [wrap]" fxLayoutAlign="space-evenly" class="w-100">
    <mat-card *ngFor="let movie of movies" class="example-card mb-5">
      <img mat-card-image style="width: 400px;" src="http://image.tmdb.org/t/p/w500{{movie.poster_path}}" alt="movies-cover">
      <mat-card-actions>
        <button [color]="isFav(movie.id) == true ? 'primary' : ''" (click)="isFav(movie.id) == true ? removeFav(movie) : addFav(movie)" mat-icon-button aria-label="Example icon button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  </div>

  `,
  styles: []
})

export class MoviesComponent implements OnInit, OnDestroy {
  error:boolean = false;
  movies!:Movie[];
  sub!:Subscription;
  isLoading:boolean = false;
  favs:Favorite[] = [];

  constructor(private moviesSrv:MoviesService, private errorSrv:ErrorService, private authSrv:AuthService) {}

  ngOnInit() : void {
    console.log('movie');

    this.fetchMovies();
    this.getFavs();
  }

  fetchMovies(){
    // inizio il recupero
    this.isLoading = true;
    this.sub = this.moviesSrv.fetchMovies().subscribe((movies) => {
      // riempio l'array
      this.movies = movies;
      this.isLoading = false;
    }, (error) => {
      // faccio partire l'errore
      this.errorSrv.openSnackBar(error.message, 'chiudi');
      this.error = true;
    })
  }

  getFavs(){
    // recupero i preferiti dell'utente e ci riempio l'array
    this.sub = this.moviesSrv.getUserFavs(this.authSrv.getUserId()).subscribe((favs)=>{
      this.favs = favs;
      //console.log(favs);
    })
  }

  // ritorna true se l'id del film è contenuto nell'array di tutti i preferiti dell'utente
  isFav(movieId:number){
    return this.favs.some((val) => val.movieId === movieId);
  }

  // aggiunge il film ai preferiti
  async addFav(movie:Movie){
    // creo l'oggetto
    let newMovieFav:Favorite = {
      movieId: movie.id,
      userId: this.authSrv.getUserId(),
      id:0
    }
    await this.moviesSrv.addFav(newMovieFav).then(()=>{
      // pusho l'oggetto
      this.favs.push(newMovieFav);
    })
  }

  // rimuove il film dai preferiti
  async removeFav(movie:Movie){
    await this.moviesSrv.removeFav(movie).then(()=>{
      // rimuovo il film dall'array
      this.favs.forEach((fav, index)=>{
        if(fav.movieId == movie.id){
          this.favs.splice(index, 1);
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
