import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSection } from '../models/hive-section';
import { HiveSectionService } from '../services/hive-section.service';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", false, "", 0);
  existed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['id'] === undefined) return;
      if (p['idSection'] === undefined) {
        this.hiveSection.storeHiveId = p['id'];
        this.existed = true;
        return;
      }
      this.hiveSectionService.getHiveSection(p['idSection']).subscribe(h => {
        this.hiveSection = h;
        this.hiveSection.storeHiveId = p['id']
      });
      this.existed = true;
    });
  }

  navigateToHiveSections() {
    if (this.hiveSection.storeHiveId === undefined || this.hiveSection.id == 0) {
      this.router.navigate(['/hives']);
    }
    else {
      this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
    }
  }

  onCancel() {
    this.navigateToHiveSections();
  }

  onSubmit() {
    if (this.hiveSection.id != 0) {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(c => this.navigateToHiveSections());
    } else {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(c => this.navigateToHiveSections());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h => this.hiveSection.isDeleted = true)
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false)
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(c => this.navigateToHiveSections())
    this.existed = false;
  }
}
