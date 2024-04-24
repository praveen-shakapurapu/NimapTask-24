import { Component, ElementRef, ViewChild } from '@angular/core';
import { UpdateComponent } from '../update/update.component';
import { JsonServerService } from '../service/json-server.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  currentUser: any
  flag: boolean = false
  @ViewChild('Updatecurrent') Updatecurrent!: ElementRef
  constructor(private serv: JsonServerService, private actv: ActivatedRoute, private dailog: MatDialog) { }

  nameProfile: any
  ngOnInit() {
   
    this.actv.params.subscribe((user) => {
      this.nameProfile = user['id']
      console.log(this.nameProfile)
    })
    // this.getUser();
    this.getUserdata()
  }

  reactiveForm = new FormGroup({
    image:new FormControl(''),
    name:new FormControl('',[ Validators.maxLength(20),Validators.pattern('[A-Za-z]')]),
    lastname:new FormControl('',),
    email:new FormControl('',[Validators.required, Validators.email]),
    mobile:new FormControl('',[Validators.required]),
    age:new FormControl('',[Validators.required]),
    state:new FormControl('',[Validators.required]),
    country:new FormControl('',[Validators.required]),
    address:new FormControl('',[Validators.required]),
    tags:new FormControl('',[Validators.required]),
    checked:new FormControl('',[Validators.required])
  })
  

  
  get image(){
    return this.reactiveForm.get('image')
  }

  get name(){
    return this.reactiveForm.get('name')
  }

  get lastname(){
    return this.reactiveForm.get('lastname')
  }
  get email(){
    return this.reactiveForm.get('email')
  }
  get mobile(){
    return this.reactiveForm.get('mobile')
  }
  get age(){
    return this.reactiveForm.get('age')
  }
  get state(){
    return this.reactiveForm.get('state')
  }
  get country(){
    return this.reactiveForm.get('country')
  }
  get address(){
    return this.reactiveForm.get('address')
  }
  get tags(){
    return this.reactiveForm.get('tags')
  }
  get checked(){
    return this.reactiveForm.get('checked')
  }

  

  userdata: any
  newUserData: any

  imgch: any = 0
  iduser: any = []

  // getUser() {
  //   this.serv.getDetails().pipe(
  //     map((data: any) => {
  //       // Filter the userdata array based on the nameProfile
  //       return data.find((user: any) => user.id === this.nameProfile);
  //     })
  //   ).subscribe(
  //     (user) => {
  //       // If user is found, update newUserData, iduser, and imgurl
  //       if (user) {
  //         this.newUserData = user;
  //         this.iduser.push(user.id);
  //         this.imgurl = user.image;
  //         console.log(this.newUserData, this.iduser);
  //       } else {
  //         console.log('User not found.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching user details:', error);
  //     }
  //   );
  // }

  getUserdata() {
    debugger
    this.serv.getDetails().subscribe((res: any) => {
      const data = res

      data.forEach((user: any) => {
        if (user.id == this.nameProfile) {
          this.currentUser = user

          this.name?.patchValue(this.currentUser.name)
          this.lastname?.patchValue(this.currentUser.lastname)
          this.email?.patchValue(this.currentUser.email)
          this.mobile?.patchValue(this.currentUser.mobile)
          this.age?.patchValue(this.currentUser.age)
          this.state?.patchValue(this.currentUser.state)
          this.country?.patchValue(this.currentUser.country)
          this.address?.patchValue(this.currentUser.address)
          this.tags?.patchValue(this.currentUser.tags)
          this.checked?.patchValue(this.currentUser.checked)
          this.imgurl=this.currentUser.image
        }
      })
    }, (error: any) => {
      console.error('Error fetching user details:', error);
    })
  }


  imgurl: any;
  PreviousPhoto: any

  onImageChange(e: any) {
    debugger
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (imgres: any) => {
        console.log(imgres.target.result);
        this.imgurl = imgres.target.result;

        if (this.imgurl) {
          this.flag = true
          // this.currentUser.file=''
          this.PreviousPhoto = this.currentUser.image
          this.currentUser.image.patchValue(this.imgurl)

        } else {
          this.flag = false
        }

        // Update file1 property of newUserData with the image URL
        this.newUserData.image = this.imgurl;
      };
    }
  }

  updatePhotos() {
    debugger
    this.flag = false
    this.reactiveForm.controls.image.patchValue(this.imgurl)
    console.log(this.reactiveForm.value)
    this.serv.updateUser(this.reactiveForm.value, this.nameProfile).subscribe(() => {
      alert('data Update Successfully!')
    })
    location.reload();

    alert('Your Profile Picture has been Updated Successfully')
  }

  cancel() {
    this.flag = false
    this.currentUser.image=this.PreviousPhoto
  }

  updateUserData() {
    if (this.userdata) {
      for (let d of this.userdata) {
        if (d.name === this.nameProfile) {
          this.newUserData = { ...d }; // Create a new object to avoid mutation
          this.iduser.push(d.id);
          console.log(this.newUserData, this.iduser);
          this.imgurl = this.newUserData.file1;
        }
      }
    }
  }


  // updateUserWithImage() {
  //   if (this.newUserData) {
  //     this.serv.updateUser(this.newUserData, this.newUserData.id).subscribe(
  //       () => {
  //         console.log('User data updated successfully');
  //       },
  //       (error) => {
  //         console.error('Error updating user data:', error);
  //       }
  //     );
  //   } else {
  //     console.error('User data is null or undefined');
  //   }
  // }

  openDialog() {
    debugger
    this.dailog.open(UpdateComponent, {
      width: "36%",
      data: this.nameProfile
    });
  }

  edit(val: any) {
    console.log(val)

  }

}