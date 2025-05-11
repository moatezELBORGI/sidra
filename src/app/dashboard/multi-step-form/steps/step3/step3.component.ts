import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css'
})
export class Step3Component {
  @Input() parentForm!: FormGroup;

  get substanceForm(): FormGroup {
    return this.parentForm.get('substanceUse') as FormGroup;
  }
  
  frequencyOptions = [
    'Quotidienne',
    'Plusieurs fois par semaine',
    'Hebdomadaire',
    'Occasionnelle (< mensuelle)',
    'Expérimentation unique'
  ];
  entourageOptions = [
    { label: 'Membre(s) de la famille', controlName: 'entourage_famille' },
    { label: 'Ami(e)s', controlName: 'entourage_amis' },
    { label: 'Milieu professionnel', controlName: 'entourage_pro' },
    { label: 'Milieu sportif', controlName: 'entourage_sport' },
    { label: 'Autre', controlName: 'entourage_autre' }
  ];

  spaTypes = [
    { label: 'Tabac', controlName: 'spa_tabac' },
    { label: 'Alcool', controlName: 'spa_alcool' },
    { label: 'Cannabis', controlName: 'spa_cannabis' },
    { label: 'Opium', controlName: 'spa_opium' },
    {
      label: 'Morphiniques de synthèse (Subutex...)',
      controlName: 'spa_morphine',
      subControl: 'morphineDrugOfSpaConsumptionEntouragesIdMorphineDrug'
    },
    { label: 'Héroïne', controlName: 'spa_heroine' },
    { label: 'Cocaïne', controlName: 'spa_cocaine' },
    {
      label: 'Hypnotiques & sédatifs',
      controlName: 'spa_sedatifs',
      subControl: 'sedativeHypnoticOfSpaConsumptionEntouragesIdSedativeHypnotic'
    },
    { label: 'Amphétamines', controlName: 'spa_amphetamines' },
    { label: 'Ecstasy', controlName: 'spa_ecstasy' },
    { label: 'Produits à inhaler', controlName: 'spa_inhalants' },
    { label: 'Prégabaline', controlName: 'spa_pregabaline' },
    { label: 'Kétamines', controlName: 'spa_ketamine' },
    { label: 'LSD', controlName: 'spa_lsd' },
    { label: 'Autre', controlName: 'spa_autre' },
  ];
}
