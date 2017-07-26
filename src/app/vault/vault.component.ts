import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from '../shared/box.service';
import { AuthService } from '../shared/auth.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class VaultComponent implements OnInit {

  private sub: any;
  public isRoot: boolean = false;
  public folder: string = undefined;
  public newFolder: any = {};
  public newNote: any = {};
  public folderList: any[] = [];
  public fileList: any[] = [];
  public info: any = {};
  public paths: any[] = [];
  public isLoading: boolean = false;
  public uploader: FileUploader;
  public isNewFolder: boolean = false;
  public isNewNote: boolean = false;
  public infoMessage: string = '';
  public errorMessage: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private boxService: BoxService) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.folder = params['folder'];
      this.folderList = [];
      this.fileList = [];
      this.info = {};
      this.paths = [];
      if (!this.folder) {
        this.folder = this.authService.getUser().folderId;
        this.isRoot = true;
      } else
        this.isRoot = false;

      this.uploader = new FileUploader({url: '/api/box/' + this.folder + '/upload'});
      this.isLoading = true;
      this.infoMessage = 'Loading...';
      this.boxService.getFolderInfo(this.folder)
      .subscribe(
        data => {
          if (data.code == 401){
            this.authService.logout();
          } else {
            if (data.data.path_collection.entries.length > 2) {
              for (let i = 2; i < data.data.path_collection.entries.length; i++) this.paths.push(data.data.path_collection.entries[i]);
            }
            this.info = data.data;

            this.boxService.getFolderList(this.folder)
            .subscribe(
              data => {
                if (data.code == 401){
                  this.authService.logout();
                } else {
                  this.isLoading = false;
                  this.folderList = [];
                  this.fileList = [];
                  for (let i = 0; i < data.data.entries.length; i++) {
                    if (data.data.entries[i].type == 'folder') this.folderList.push(data.data.entries[i]);
                    else this.fileList.push(data.data.entries[i]);
                  }

                }
              },
              err => {
                this.isLoading = false;
                console.log(err);
              });
          }
        },
        err => {
          this.isLoading = false;
          console.log(err);
        });

    });

    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      
    };

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.fileList.push(JSON.parse(response).data);
      this.isLoading = false;
    };

    this.uploader.onAfterAddingFile = (item: any) => {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openCreateFolder() {
    this.newFolder = {name: '', description: ''};
    this.errorMessage = '';
    this.isNewFolder = true;
  }

  openCreateNote() {
    this.newNote = {name: '', content: ''};
    this.errorMessage = '';
    this.isNewNote = true;
  }

  addNew() {
    if (this.isNewFolder == true) {
      if (this.newFolder.name == '' || this.newFolder.description == '') {
        this.errorMessage = 'Please input field!';
        return;
      }
      this.isLoading = true;
      this.infoMessage = 'Creating new folder...';
      this.errorMessage = '';
      this.isNewFolder = false;
      this.boxService.createFolder(this.newFolder, this.folder)
      .subscribe(
        data => {
          if (data.code == 401){
            this.authService.logout();
          } else {
            this.isLoading = false;
            if (data.data.code == 'item_name_in_use') {

            } else
              this.folderList.push(data.data);
          }
        },
        err => {
          this.isLoading = false;
          console.log(err);
        });
    } else if(this.isNewNote == true) {
      if (this.newNote.name == '' || this.newNote.content == '') {
        this.errorMessage = 'Please input field!';
        return;
      }
      this.isLoading = true;
      this.infoMessage = 'Creating new note...';
      this.errorMessage = '';
      this.isNewNote = false;
      this.boxService.createNote(this.folder, this.newNote)
      .subscribe(
        data => {
          this.isLoading = false;
          this.fileList.push(data.data);
        },
        err => {
          this.isLoading = false;
          console.log(err);
        });
    }
  }

  fileChange(event) {
    let that = this;
    setTimeout(function() {
      that.isLoading = true;
      that.infoMessage = 'Uploading...';
      that.uploader.uploadAll();
    }, 600);
  }

  downloadFile(fileId) {
    this.isLoading = true;
    this.infoMessage = 'Downloading...';
    this.boxService.downloadFile(fileId)
    .subscribe(
      data => {
        this.isLoading = false;
        location.href = (data.data);
      },
      err => {
        this.isLoading = false;
        console.log(err);
      });
  }

  deleteItem(id, type) {
    this.isLoading = true;
    this.infoMessage = 'Deleting...';
    this.boxService.deleteItem(id, type)
    .subscribe(
      data => {
        this.isLoading = false;
        if (type == 'folder') {
          for(let i = 0; i < this.folderList.length; i++) {
            if (this.folderList[i].id == id) {
              this.folderList.splice(i, 1);
              break;
            }
          }
        } else {
          for(let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].id == id) {
              this.fileList.splice(i, 1);
              break;
            }
          }
        }
        
      },
      err => {
        this.isLoading = false;
        console.log(err);
      });
  }

  onClick(event) {
   if (event.target.id == 'custom-modal-container') {
     this.isNewFolder = false;
     this.isNewNote = false;
   }
  }

}
