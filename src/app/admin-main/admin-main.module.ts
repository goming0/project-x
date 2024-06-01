import { NgModule } from '@angular/core';
import { AdminMainComponent } from './admin-main.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { FBaseService } from '../services/fireStore/fbase.service';
import { SearchModule } from 'src/libs/ui/searchBar/search.module';
import { EllipsePipe } from './pipe ellipse/ellipse.pipe';

@NgModule({
  declarations: [AdminMainComponent, EllipsePipe],
  imports: [
    RouterModule.forChild([{ path: '', component: AdminMainComponent }]),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SearchModule,
  ],
  providers: [],
})
export class AdminMainModule {}
