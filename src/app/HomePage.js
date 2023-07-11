import React, {useMemo, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Input,
    Radio,
    RadioGroup
} from "@mui/material";
import moment from "moment/moment";

const HomePage = () => {
    const [gender, setGender] = useState("male");
    const [birthday, setBirthday] = useState("");
    const [displayResults, setDisplayResults] = useState(false);
    const [finalRetirementDate, setFinalRetirementDate] = useState(null);

    const onSubmit = () => {
        if (gender === "male") {
            calculateRetirementYear(65, 0, true)
        } else {
            calculateRetirementYear(60, 2)
        }
        setDisplayResults(true);
    }

    const calculateRetirementYear = (baseYears, baseMonths, isMale = false) => {
        if ((isMale && moment(birthday).get('year') <= 1967) || (!isMale && moment(birthday).get('year') <= 1955)) {
            const retirementDate = moment(birthday).add(baseYears, 'year').add(baseMonths, 'months').format('YYYY-MM-DD');
            setFinalRetirementDate(retirementDate);
            return;
        }
        if (isMale) {
            const monthsToAdd = moment(birthday).get('year') - 1967;
            if (monthsToAdd > 24) {
                const retirementDate = moment(birthday).add(67, 'years').format('YYYY-MM-DD');
                setFinalRetirementDate(retirementDate);
            } else {
                const retirementDate = moment(birthday).add(baseYears, 'years').add(monthsToAdd, 'months').format('YYYY-MM-DD');
                setFinalRetirementDate(retirementDate);
            }
        } else {
            const monthsToAdd = (moment(birthday).get('year') - 1955) * 2;
            if (monthsToAdd > 82) {
                const retirementDate = moment(birthday).add(67, 'year').format('YYYY-MM-DD');
                setFinalRetirementDate(retirementDate);
            } else {
                const retirementDate = moment(birthday).add(baseYears, 'years').add(monthsToAdd, 'months').format('YYYY-MM-DD');
                setFinalRetirementDate(retirementDate);
            }
        }
    }

    const ageOfRetirement = useMemo(() => {
        if (!!finalRetirementDate) {
            const age = moment(finalRetirementDate.toString(), 'YYYY-MM-DD');
            if (age) {
                const yearsDiff = age.diff(birthday, 'years');
                age.subtract(yearsDiff, 'years');
                const monthsDiff = age.diff(birthday, 'months');
                return yearsDiff + " vjec e " + monthsDiff + " muaj";
            }
            return '';
        }
    }, [finalRetirementDate])

    const calculateWorkExperience = useMemo(() => {
        if (!finalRetirementDate) {
            return '';
        }
        let baseYears = 35;
        let baseMonths = 4;
        if (moment(finalRetirementDate.toString(), 'YYYY-MM-DD').get('year') <= 2015) {
            return baseYears + ' vite e' + baseMonths + ' muaj';
        }
        const monthsToAdd = (moment(finalRetirementDate.toString(), 'YYYY-MM-DD').get('year') - 2015) * 4;
        baseYears += monthsToAdd / 12;
        baseMonths += monthsToAdd % 12;
        if (baseMonths === 12) {
            baseYears += 1
            baseMonths = 0
        }
        if(baseYears >= 40) {
            return '40 vite';
        }
        return baseYears.toFixed(0) + ' vite e ' + baseMonths + ' muaj';
    }, [finalRetirementDate])

    return (
        <div>
            <div className="text-2xl text-blue-700 font-bold mb-10">Llogarit moshen e daljes ne pension</div>
            <FormControl>
                <FormLabel className="text-center" id="demo-row-radio-buttons-group-label">Gjinia</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="female" checked={gender === 'female'} control={<Radio/>} label="Femër"
                                      onClick={() => setGender("female")}/>
                    <FormControlLabel value="male" checked={gender === 'male'} control={<Radio/>} label="Mashkull"
                                      onClick={() => setGender("male")}/>
                </RadioGroup>
            </FormControl>
            <div className="my-20">
                <FormControl>
                    <FormLabel className="text-center" id="demo-row-radio-buttons-group-label">Datëlindja</FormLabel>
                    <Input id="date" color="primary" type="date" value={birthday}
                           onChange={(e) => setBirthday(e.target.value)}/>
                </FormControl>
            </div>
            <Button variant="outlined" onClick={onSubmit}>Llogarit</Button>
            {displayResults && (
                <Card className="mt-20 p-5">
                    <div className="flex justify-center text-blue-700 font-semibold">Rezultati</div>
                    <CardContent>
                        <div>Del ne pension ne {moment(finalRetirementDate, 'YYYY-MM-DD').format('DD MMMM YYYY')}</div>
                        <div>Mosha e daljes ne pension: {ageOfRetirement}</div>
                        <div>Eksperienca e punes: {calculateWorkExperience}</div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default HomePage;