import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormsService {
    private formGroup!: FormGroup;

    constructor(private fb: FormBuilder) {
        this.initForm();
    }

    private initForm(): void {
        this.formGroup = this.fb.group({
            // Partie 1: Informations sur la structure/centre de prise en charge & l'usager de SPA
            structureInfo: this.fb.group({
                sector: ['', Validators.required],
                ongStructureId: [''],
                structureId: ['', Validators.required],
                structureDemandedStructureId: ['', Validators.required],
                fName: [''],
                lName: [''],
                patientId: ['', Validators.required],
                consultationDate: ['', Validators.required],
                gender: ['', Validators.required],
                birthDate: ['', Validators.required],
                nationalityUuidCountry: ['', Validators.required],
                residence: ['', Validators.required],
                governorateOfResidenceUuidGovernorate: [''],
                cityOfResidenceUuidCity: [''],
                countryOfResidenceUuidCountry: [''],
                consultancyFrame: [null, Validators.required],
                otherConsultancyFrame: [''],
                originOfDemandSetUuidOriginOfDemands: this.fb.array([]),
                otherOriginOfDemand: [''],
                oldConsultancy: ['', Validators.required],
                oldConsultancyDate: [''],
                oldConsultancyMotifUuidConsultancyMotif: [''],
                otherOldConsultancyMotif: [''],
                reasonForRecidivismUuidReasonForRecidivism: [''],
                otherReasonForRecidivism: [''],
                reasonForWithdrawalUuidReasonForWithdrawal: [''],
                otherReasonForWithdrawal: [''],
                familySituationIdFamilySituation: [null, Validators.required],
                otherFamilySituation: [''],
                accommodationTypeIdAccommodationType: [null, Validators.required],
                otherAccommodationType: [''],
                stableAccommodation: ['', Validators.required],
                professionUuidProfession: [null, Validators.required],
                schoolLevelUuidSchoolLevelSchoolLevel: [null, Validators.required],
                practiceSport: ['', Validators.required],
                regularPracticeSportWay: [''],
                competitionSportWay: [''],
                doping: ['']
            }),

            // Partie 2: Consommation de tabac/produits tabagiques & alcool
            tobaccoAlcohol: this.fb.group({
                tobaccoConsumption: ['', Validators.required],
                ageOfTobaccoConsumption: [''],
                tobaccoConsumedWithinThirtyDays: [''],
                tobaccoConsumptionFrequencyUuidConsumptionFrequency: [''],
                ageOfStoppingTobaccoConsumption: [''],
                alcoholConsumption: [''],
                ageOfAlcoholConsumption: [''],
                alcoholConsumedWithinThirtyDays: [''],
                alcoholConsumptionFrequencyUuidConsumptionFrequency: ['']
            }),

            // Partie 3: Consommation de substances psychoactives
            substanceUse: this.fb.group({
                spaConsumptionInEntourage: [],
                cannabisFrequency: [''],
                cocaine: [false],
                cocaineFrequency: [''],
                amphetamines: [false],
                amphetaminesFrequency: [''],
                opioids: [false],
                opioidsFrequency: [''],
                hallucinogens: [false],
                hallucinogensFrequency: [''],
                otherSubstances: [false],
                otherSubstancesDetails: ['']
            }),

            // Partie 4: Comportements liés à la consommation des SPA et tests de dépistage
            behaviorsAndTests: this.fb.group({
                injectionUse: [false],
                needleSharing: [false],
                sexualRiskBehaviors: [false],
                hivTested: [false],
                hivResult: [''],
                hcvTested: [false],
                hcvResult: [''],
                hbvTested: [false],
                hbvResult: ['']
            }),

            // Partie 5: Comorbidités
            comorbidities: this.fb.group({
                psychiatricDisorders: [false],
                psychiatricDisordersDetails: [''],
                cardiovascularDisease: [false],
                respiratoryDisease: [false],
                liverDisease: [false],
                neurologicalDisorders: [false],
                otherHealthIssues: [false],
                otherHealthIssuesDetails: ['']
            }),

            // Partie 6: Décès induit par les SPA dans l'entourage
            spaDeaths: this.fb.group({
                deathsInSocialCircle: [false],
                numberOfDeaths: [0],
                relationshipToDeceased: [''],
                substanceInvolved: [''],
                overdoseInvolved: [false]
            })
        });
    }

    getFormGroup(): FormGroup {
        return this.formGroup;
    }
}
