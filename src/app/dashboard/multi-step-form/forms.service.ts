import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

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
                originOfDemandSetUuidOriginOfDemands:  [[]],
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
                alcoholConsumption: ['', Validators.required],
                ageOfAlcoholConsumption: [''],
                alcoholConsumedWithinThirtyDays: [''],
                alcoholConsumptionFrequencyUuidConsumptionFrequency: ['']
            }),

            // Partie 3: Consommation de substances psychoactives
            substanceUse: this.fb.group({
                spaConsumptionInEntourage: [null, Validators.required],
                spaConsumptionEntourageUuidEntourages: [[]],
                otherSpaConsumptionInEntourage: [''],
                typesOfSpaConsumptionEntourageAnswers: [[]],
                morphineDrugOfSpaConsumptionEntouragesIdMorphineDrug: [''],
                sedativeHypnoticOfSpaConsumptionEntouragesIdSedativeHypnotic: [''],
                otherTypesOfSpaConsumptionEntourages: [''],
                spaConsumptionOtherThanAlcoholAndTobacco:[null, Validators.required],
                typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages: [[]],
                morphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug:[''],
                sedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic:[''],
                otherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco:[''],

                initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages:[[]],
                initialTypesMorphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug:[''],
                initialTypesSedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic:[''],
                initialTypesOtherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco:[''],
                ageOfInitialTypesSedativeHypnoticOtherThanAlcoholAndTobacco:['']


            }),

            // Partie 4: Comportements liés à la consommation des SPA et tests de dépistage
            behaviorsAndTests: this.fb.group({
                usualRouteOfAdministrationOfPrincipalSubstanceUuidUsualRouteOfAdministration: [[]],
                otherUsualRouteOfAdministrationOfPrincipalSubstance: [''],
                usualRouteOfAdministrationFrequencyOfPrincipalSubstanceUuidConsumptionFrequency: [[]],
                ageOfConsumptionOfPrincipalSubstance: [],
                notionOfSyringeSharingUuidNotionOfSyringeSharing: [[]],
                vihTest: [],
                dateVihTest: [''],
                vhcTest: [],
                dateVhcTest: [''],
                vhbTest: [],
                dateVhbTest: [''],
                supportForWeaning:[''],
                whyNotSupportForWeaning:[''],
                triedToQuit:[''],
                withWhoTriedToQuitUuidTriedToQuit:[''],
                healthStructureTriedToQuit:['']
            }),

            // Partie 5: Comorbidités
            comorbidities: this.fb.group({
                hasPersonalPsychiatricComorbidity: [],
                personalPsychiatricComorbidityDetails: ['',Validators.required],
                hasPersonalSomaticComorbidity: [],
                personalSomaticComorbidityDetails: ['',Validators.required],
                hasPartnerPsychiatricComorbidity: [],
                partnerPsychiatricComorbidityDetails: ['',Validators.required],
                hasPartnerSomaticComorbidity: [],
                partnerSomaticComorbidityDetails: ['',Validators.required]
            }),

            // Partie 6: Décès induit par les SPA dans l'entourage
            spaDeaths: this.fb.group({
                nbDeathCauseBySpaInEntourage: ['',Validators.required],
                deathCauseBySpaInEntourage: ['']
            })
        });
    }

    getFormGroup(): FormGroup {
        return this.formGroup;
    }
}
