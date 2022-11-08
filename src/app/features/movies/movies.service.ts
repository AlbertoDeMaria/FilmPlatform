import { switchMap, map } from 'rxjs';
import { Favorite } from './../../model/favorite';
import { AuthService } from './../../auth/auth.service';
import { Movie } from './../../model/movie';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {

  baseURL = 'http://localhost:4201';

  constructor(private http:HttpClient, private authSrv:AuthService) {}

  // recupero tutti i film
  fetchMovies(){
    return this.http.get<Movie[]>(`${this.baseURL}/movies-popular`)
  }

  // recupero i preferiti dell'utente
  getUserFavs(userId:number){
    return this.http.get<Favorite[]>(`${this.baseURL}/favorites?userId=${userId}`)
  }

  // aggiungo un oggetto fav ai preferiti
  addFav(fav:Favorite){
    return this.http.post(`${this.baseURL}/favorites`, fav).toPromise()
  }

  // trova l'id del preferito
  getFavIdByMovie(movie:Movie){
    let userId = this.authSrv.getUserId();
    return this.http.get<Favorite[]>(`${this.baseURL}/favorites?userId=${userId}&movieId=${movie.id}`).pipe(
      map((res)=> res[0])
    )
  }

  // elimino il preferito
  removeFav(movie: Movie) {
    return this.getFavIdByMovie(movie).pipe(
      switchMap((data) => this.http.delete(`${this.baseURL}/favorites/${data.id}`))).toPromise();
  }

}
